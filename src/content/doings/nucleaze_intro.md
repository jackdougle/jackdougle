_Crossposted on the [High Impact Engineers forum](https://github.com/orgs/High-Impact-Engineers/discussions/36) and [Rust forum](https://users.rust-lang.org/t/introducing-nucleaze-fast-multi-threaded-k-mer-sequence-filtration/138630)_.

#### Hi Rustaceans!

I'm excited to announce [Nucleaze](https://crates.io/crates/nucleaze), a fast, multi-threaded bioinformatics tool that sorts DNA/RNA sequences based on k-mer similarity to reference sequences. At a high level, it builds an index of reference k-mers, checks if each read sequence contains a reference k-mers, and outputs matched and unmatched sequences. 

It was primarily developed for the [Nucleic Acid Observatory](https://naobservatory.org), and benchmarks show better performance against tools like BBDuk. I have some ideas on how to further accelerate Nucleaze, and I'd like to query the community on how to progress. This project is my only Rust experience, so I'd be ecstatic if more experienced developers could review the ideas below and provide some direction (or contribute directly to the repository)!

---
#### Open problems

##### Bloom filter

In all current releases, k-mer storage and matching is lossless, meaning Nucleaze is perfectly accurate. This is useful, but some false positives would be acceptable for faster indexing or (more importantly) read processing. [Bloom filters](https://systemdesign.one/bloom-filters-explained/) are theoretically perfect for this use case.

Bloom filters answer membership queries extremely quickly and with low memory overhead, while never returning false negatives. In a read filtration context, some false positives are often completely acceptable depending on downstream analysis.

Starting in `v1.5.0-alpha` (currently in development), Nucleaze uses Bloom filters to support an "approximate" mode of k-mer storage. The Bloom filter is currently sized at runtime based on the average number of k-mers in a read sequence and a specified false positive rate (`--fpr`).

I've yet to get approximate mode to be competitive with lossless mode's performance while maintaining the user's input false positive rate. I've tried multiple implementations where I've optimized one variable to the detriment of the other. Here are two such cases:

```rust
impl KmerStore for BloomFilter {
    // Single-hash: super fast w/ huge number of false positives.
    fn contains(&self, kmer: &u64) -> bool {
        // K-mers sharing a bit position always alias each other.
        let pos = kmer & self.mask;
        let idx = (pos / 64) as usize;
        self.items[idx] & (1 << (pos % 64)) != 0
    }

    // Multi-hash: ideal false positive rate w/ much worse performance.
    fn contains(&self, kmer: &u64) -> bool {
        let (h1, h2) = bloom_hash(*kmer);
        // Performance inversely scales with num_hashes.
        for i in 0..self.num_hashes as u64 {
            let pos = h1.wrapping_add(i.wrapping_mul(h2)) & self.bit_mask;
            let idx = (pos >> 6) as usize;
            if self.items[idx] & (1 << (pos & 63)) == 0 {
                return false;
            }
        }
        true
    }
}
```

Since either implementation accomplishes one goal, I believe there's a better Bloom filter implementation that can accomplish both. I'd greatly appreciate feedback here. 

---
##### Minimizer-based sharding

Nucleaze's default k-mer storage data structure is a vector comprised of 1024 `FxHashSets` or "shards". Each k-mer is mapped to a shard using the function below:

```rust
impl KmerStore for HashShards {
    /// Hash k-mer and return shard index.
    fn map(&self, kmer: &u64) -> usize {
        let hashed = kmer ^ (kmer >> 12);
        // self.mask = 0b111111111
        hashed as usize & self.mask
    }
}
```

The hash function spreads entropy well and is computationally lightweight by deterministically analyzing the last 6 bases (12 bits) of every k-mer. However, adjacent k-mers are very unlikely to have the same last 6 bases, meaning adjacent k-mers are almost always mapped to different shards. This, in turn, forces the CPU to constantly load in new shards, causing constant cache misses and throttling performance. 

Minimizers are often used to fix this issue, as they map k-mers to shards based on the lexicographically smallest *m* bases, which generally change every *k* or so k-mers. A minimizer based system would have *k* times fewer cache misses and potentially improved performance. 

Unfortunately, finding the smallest m-mer requires iterating through a k-mer, causing a performance burden that's generally dwarfed the benefits I've gotten from fewer cache misses. 

An ideal implementation would query k-mers independently and return the same shard mapping for broadly similar (or adjacent) k-mers without iterating fully through each one. That implementation would maximally avoid the performance cost of cache misses *and* iterating through k-mers. I think such an implementation lurks nearby, I'd love input on what it looks like.

---
#### Contributions are welcome!

The repository is currently in flux. The latest tagged release (`v1.4.2`) is stable and deployed in production, but only uses sharded `FxHashSets` to store k-mers. The `main` branch currently implements generics to support both Bloom filter and sharded `FxHashSets`, both wrapped in custom structs. If `--fpr` is omitted, behavior and performance are identical to version 1.4.2.

If you have any code, ideas, or advice on how to better implement Bloom filters, minimizer-based mappings, and improving Nucleaze as a whole, I'd love to start a dialogue. Feel free to contact me at jack.gdouglass@gmail.com and check out the repository at [https://github.com/jackdougle/nucleaze](https://github.com/jackdougle/nucleaze).