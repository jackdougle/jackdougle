*Note: I have no conception of how computational fluid dynamics or public space regulation & modification works. Bad assumptions likely abound here. That being said, I hope this post sparks someone’s curiosity.*

Despite the fact houses played host to the majority of COVID-19 transmission, I think another building type, supermarkets, may be a better target for biohardening in the near-to-medium term. Supermarkets are essential for societal function and won’t close down en masse unless we’re in an existentially-threatening pandemic[^1].

Up until that point, supermarkets only get **more** important as pandemics worsen in severity. If people are sufficiently scared they’ll contract a dangerous pathogen if they venture outside, they’ll sacrifice frivolous social outings and work from home. However, they’ll still have to buy groceries at a meaningful frequency, meaning in-supermarket transmission might contribute proportionately more to pandemic spread. I’d also be remiss not to mention supermarket workers here. Many may very well put their lives on the line in a future pandemic, and deserve the best fortifications society can build.

![](/blog/biohardening-supermarkets.png)

### A potential strategy for biohardening larger rooms

When biohardening a small-ish space (e.g. a house living room), it’s not especially clear what the optimal strategy is. As of now, HEPA filters are [cheaper per eACH added](https://defensesindepth.bio/on-far-uvc-and-air-filtration-2/) compared to far-UVC lamps, yet come with ergonomic drawbacks (e.g. noisy, occupy floor space). Far-UVC is also [approaching cost-competitiveness](https://www.jefftk.com/p/contra-binder-on-far-uvc-and-filtration?ref=defensesindepth.bio). In a human-communicable pandemic, I’d still lean towards a [HEPA filter](https://www.amazon.com/Coway-AP-1512HH-Mighty-Purifier-White/dp/B01728NLRG/ref=sr_1_1?crid=28RTXIBDB7L7J&dib=eyJ2IjoiMSJ9.kc6gSOYFCq96uncD65N7ig859i5Fo0EnFxgI5SL79opp_kinPartcdTL2XEy_DdMgTxlq0S9Ew4kFOQeOOm10SBKc_5ExZvq5yJ52BgPnrskqzUiw7RkSSSu38wtFN6lRHxX6EUOiKoMVMDSrTEmDMGFkAaJGzE-CRI0fY1btgNET5mF5TtyxPKZeKD788jFy8XmCuKE018S2GZP9g2cAUftHa-g88k2VKvpboLpZTM.d2VhoRMbEkfY6ATXJ7obPeru58Z0gtc0MujSKauUyFA&dib_tag=se&keywords=Coway%2BAP-1512HH%2BAirmega%2B200M&qid=1783463063&sprefix=coway%2Bap-1512hh%2Bairmega%2B200m%2Caps%2C173&sr=8-1&th=1) if I were biohardening my own home, but I wouldn’t be surprised if far-UVC leapt ahead in 3-5 years.

Conversely, I think there’s a clearer strategy for grocery stores (and maybe large spaces with high ceilings in general). Maintaining the same eACH with portable HEPA filters becomes proportionately more difficult in increasingly larger rooms. A Walmart Supercenter[^2], for instance, requires a clean air delivery rate 2-3 orders of magnitude higher (and thus 2-3 orders of magnitude more HEPA filtration) to maintain eACH parity with homes[^3],[^4].

On the other hand, circulating all that air is cheap as large fans can mix massive air volumes with relatively little energy. Better circulation might reduce the size and frequency of stagnant zones, and may push more air through UVC-irradiated zones more often. Thus, a decent general strategy for biohardening large public spaces could involve installing fans that shuttle air towards a few UVC zones[^5], potentially avoiding a significant chunk of the cost of supplying the same clean air delivery through HEPA filters.

### Supermarkets might be relatively easy to bioharden

A perfect far-UVC location sees a lamp positioned above an area where air circulates **just slowly enough** that passing pathogens receive an inactivating dose of irradiation, but no slower, so as much air as possible can be disinfected. Imagine a pathogen whose inactivating dose is 3 seconds-worth of far-UVC irradiation[^6]. In the best case, a far-UVC lamp would be placed in a location where illuminated air passed through in exactly 3 seconds.

Unlike the platonic ideal of a large room, supermarkets are packed with things. Fan circulation is one of many impingements on airflow. Aisle arrangement, vent locations, refrigerated and reheated air plumes, and people create an obstacle course that air races through. Such dynamics attach together to form recurring airflow paths and stagnant zones around markets, some of which may contain especially close-to-perfect installation locations. A far-UVC lamp placed along one of these paths could repeatedly irradiate a large portion of the passing air, with its added eACH depending on how much air crosses the illuminated zone slow enough to incur an inactivating dose. Covering more such locations would add eACH linearly.

I think it’s also possible that many supermarkets have similar air currents, and thus similar ideal far-UVC installation locations. Floor plans between different Walmart locations, for example, vary based on region-specific needs (e.g. a store close to a lake will have an expanded boating section). However, many supermarket companies[^7] have incentive to keep things largely procedural. Grocers often place staple foods far apart to maximize the number of products the average vendee passes along the way. Big Supermarket, with its wealth of consumer data, has likely found the best-ish way to do so by now, and has profit-motivation to spam that design as much as possible. Also, reusing layouts speedruns construction planning and reduces friction for customers used to other instantiations of the same store.

This matters because the arrangement of staple foods generally predicts the arrangement of aisles and other important landmarks like refrigerated sections, reheated areas, and perhaps even HVAC layouts. Customer movement is probably ineffectual because movement is guided by layouts and likely isn’t substantive enough to affect airflow anyway. So while two supermarkets will not have identical airflow, grocery store chains *just might* have a small number of repeatable airflow patterns and, consequently, a number of consistently useful far-UVC locations.

### And then I remembered upper-room GUV

[Upper-room germicidal UV](https://www.cdc.gov/niosh/ventilation/germicidal-ultraviolet/index.html) (URGUV) may be an even better option for supermarkets. Far-UVC fires columns of UV irradiation that extend downwards disinfect air at human heights. URGUV, on the other hand, layers rows of UV irradiation near room ceilings. As mentioned above, supermarkets generally have tall ceilings that extend above aisles, potentially allowing URGUV rays to disinfect circulated air unimpeded. URGUV probably even synergizes with fans better than far-UVC does, as mixing air strata is critical for ensuring pathogens are hit by GUV rays. The main determinant here is cost, which is highly uncertain, but probably in URGUV’s favor as of now given the lack of good industry-facing far-UVC options on the market.

[^1]: In my opinion, only a pathogen that becomes ubiquitous in the environment (like [mirror life](https://www.science.org/doi/pdf/10.1126/science.ads9158?casa_token=zZ79uQsq5OIAAAAA:juZ4nC1ZyJHqkBeu4yHMCp21xsKj7pchIKOxZT_evsXQsziNKpfe6Ey-SCzrTZMDclkuaVKJXZqq8XXP)) has a chance of existentially threatening humanity’s future.

[^2]: Picking the largest Walmart building type does help my argument here, as HEPA filters scale comparatively better in smaller spaces. However, Supercenters also comprise the vast majority ([68%](https://corporate.walmart.com/about/location-facts/united-states)) of Walmart stores in US. Even within the remaining 32%, a majority occupy over 100,000 ft².

[^3]: Shuttling sufficient amounts of clean air into a room through filtration alone becomes far harder as room volume increases, since adding a marginal effective air change per hour (eACH) requires cycling increasingly larger quantities of air through a small aperture. To illustrate with semi-real numbers:

    1. Walmart Supercenters occupy, on average, [178,000 ft²](https://stock.walmart.com/company-information/faq) of floor space.
    2. Reddit claims Supercenter ceilings range from 18-30 feet tall and slope down past the storefront.
    3. Assuming flat 24 ft ceilings are a decent ceiling proxy, a Walmart Supercenter has an average room volume of 4.3 million ft³.
    4. Your average American living room has a volume of 2,000 ft³, implying Supercenters are around **2,150x more voluminous**.
    5. To maintain eACH parity, you’d need 2,150x the clean air delivery rate. Adding HEPA filters increases that rate linearly, meaning you’d need ~2,150x the amount of HEPA filtration for your average Walmart Supercenter.

[^4]: Granted, targeting equivalent added eACH numbers probably isn’t necessary unless we’re in a cataclysmically bad human-transmissible pandemic. This is because Walmart Supercenters (hopefully) won’t be as densely populated as living rooms, and because they already have decent HVAC infrastructure.

[^5]: If dead zones are a small issue and far-UVC lamps aren’t generally bottlenecked by how much air passes through them, my fan circulation point is pretty useless.

[^6]: Inactivating doses are actually probabilistic. You could think of these hypothetical 3 seconds as the pathogen’s LD50.

[^7]: Anecdotally, the layouts of grocery stores that co-opt “natural vibes” (e.g. Trader Joe’s) tend to be more varied, probably in an effort to seem more sporadic in a lived-in, personable, way. I’d also guess this is true for smaller grocery stores broadly, as they’re probably more amenable to occupying existing buildings.
