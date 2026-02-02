import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const photo1 = "/plant.png"; 
const photo2 = "/minion.jpg"; 
const photo3 = "/korra.png"; 
const photo4 = "/sunset.jpg"; 
const photo5 = "/prague-day.JPG";
const photo6 = "/oslo.png";
const photo7 = "/river.JPG";
const photo8 = "/cow.JPG";

const FloatingOrbs = () => {
    const containerRef = useRef(null);
    const mousePos = useRef({ x: -1000, y: -1000 });
    const imageSources = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8];

    useEffect(() => {
        if (!containerRef.current) return;

        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Balanced text zone boundaries
        const centerStart = width * 0.25; 
        const centerEnd = width * 0.75;
        
        // Home positions moved back to a balanced central gutter location
        const leftHome = { x: width * 0.125, y: height / 2 };
        const rightHome = { x: width * 0.875, y: height / 2 };
        
        const minVelocity = 0.03; 
        const numOrbs = imageSources.length;

        // 1. DATA INITIALIZATION
        const nodes = d3.range(numOrbs).map((i) => {
            const randomRadius = Math.random() * 25 + 80; 
            const side = i % 2 === 0 ? 'left' : 'right';
            const home = side === 'left' ? leftHome : rightHome;
            
            return {
                r: randomRadius,
                x: home.x + (Math.random() - 0.5) * 100,
                y: home.y + (Math.random() - 0.5) * 200,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                img: imageSources[i % imageSources.length],
                side: side
            };
        });

        const container = d3.select(containerRef.current);
        container.selectAll(".orb").remove();

        // 2. CREATE DOM ELEMENTS
        const orbs = container.selectAll(".orb")
            .data(nodes)
            .enter()
            .append("div")
            .attr("class", "orb absolute rounded-full bg-cover bg-center border-2 border-black shadow-2xl cursor-grab active:cursor-grabbing pointer-events-auto")
            .style("width", d => d.r * 2 + "px")
            .style("height", d => d.r * 2 + "px")
            .style("background-image", d => `url(${d.img})`);

        // 3. FORCE SIMULATION
        const simulation = d3.forceSimulation(nodes)
            .velocityDecay(0.4) 
            .force("x", d3.forceX().x(d => d.side === 'left' ? leftHome.x : rightHome.x).strength(0.05))
            .force("y", d3.forceY().y(height / 2).strength(0.04))
            .force("collide", d3.forceCollide().radius(d => d.r).strength(0.8).iterations(10))
            .force("charge", d3.forceManyBody().strength(-150)) 
            .on("tick", ticked);

        simulation.alphaTarget(0.02).restart();

        // 4. MOUSE & DRAG BEHAVIOR
        const drag = d3.drag()
            .on("start", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.2).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0.02);
                d.fx = null;
                d.fy = null;
            });

        orbs.call(drag);

        const handleMouseMove = (e) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
            if (simulation.alpha() < 0.2) simulation.alpha(0.2).restart();
        };

        window.addEventListener('mousemove', handleMouseMove);

        function ticked() {
            nodes.forEach(node => {
                if (node.fx) return;

                // Mouse Perturbation
                const mDx = node.x - mousePos.current.x;
                const mDy = node.y - mousePos.current.y;
                const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
                const repelRadius = 250;

                if (mDist < repelRadius) {
                    const force = Math.pow((repelRadius - mDist) / repelRadius, 2);
                    node.vx += (mDx / mDist) * force * 1.5;
                    node.vy += (mDy / mDist) * force * 1.5;
                }

                // Subtle Meander
                node.vx += (Math.random() - 0.5) * 0.015;
                node.vy += (Math.random() - 0.5) * 0.015;

                // Velocity Clamping
                const currV = Math.sqrt(node.vx ** 2 + node.vy ** 2);
                if (currV < minVelocity) {
                    node.vx *= 1.1; 
                    node.vy *= 1.1;
                }

                // TEXT BARRIER (Strict avoidance)
                if (node.side === 'left' && node.x + node.r > centerStart) {
                    node.x = centerStart - node.r;
                    node.vx = -Math.abs(node.vx) - 0.2;
                } else if (node.side === 'right' && node.x - node.r < centerEnd) {
                    node.x = centerEnd + node.r;
                    node.vx = Math.abs(node.vx) + 0.2;
                }

                const margin = 10; 
                if (node.x - node.r < margin) { 
                    node.x = node.r + margin; 
                    node.vx = Math.abs(node.vx) * 0.5; 
                }
                if (node.x + node.r > width - margin) { 
                    node.x = width - node.r - margin; 
                    node.vx = -Math.abs(node.vx) * 0.5; 
                }
                if (node.y - node.r < margin) { 
                    node.y = node.r + margin; 
                    node.vy = Math.abs(node.vy) * 0.5; 
                }
                if (node.y + node.r > height - margin) { 
                    node.y = height - node.r - margin; 
                    node.vy = -Math.abs(node.vy) * 0.5; 
                }
            });

            orbs
                .style("left", d => (d.x - d.r) + "px")
                .style("top", d => (d.y - d.r) + "px");
        }

        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            simulation.force("x").x(d => d.side === 'left' ? newWidth * 0.125 : newWidth * 0.875);
            simulation.force("y").y(newHeight / 2);
            simulation.alpha(0.2).restart();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            simulation.stop();
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="fixed inset-0 pointer-events-none -z-10 h-full w-full overflow-hidden select-none" 
        />
    );
};

export default FloatingOrbs;