import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { IdeaNode } from '../types';
import { UserMenu } from './UserMenu';

interface GalaxyViewProps {
  ideas: IdeaNode[];
  goBack: () => void;
}

// Fix: The d3.SimulationNodeDatum properties are added here directly.
// While `Node` could extend `d3.SimulationNodeDatum`, explicitly adding the
// properties resolves TypeScript errors in drag handlers where type inference
// for the augmented node object can be problematic.
interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export const GalaxyView: React.FC<GalaxyViewProps> = ({ ideas, goBack }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || ideas.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const nodes: Node[] = ideas.map(idea => ({
      id: idea.id,
      name: idea.projectName || 'Untitled Idea'
    }));

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink([]).id((d: any) => d.id))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(60));

    const g = svg.append("g");

    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .enter().append("g")
      .attr("class", "cursor-pointer")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", 40)
      .attr("fill", "#6A45FF")
      .attr("stroke", "#2C2C35")
      .attr("stroke-width", 3);

    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "white")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .text(d => d.name.length > 10 ? d.name.substring(0, 9) + '...' : d.name);

    simulation.on("tick", () => {
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, any>, d: Node) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x ?? null;
      d.fy = d.y ?? null;
    }
    function dragged(event: d3.D3DragEvent<SVGGElement, Node, any>, d: Node) {
      d.fx = event.x;
      d.fy = event.y;
    }
    function dragended(event: d3.D3DragEvent<SVGGElement, Node, any>, d: Node) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
      g.attr('transform', event.transform);
    });

    svg.call(zoom as any);

  }, [ideas]);

  return (
    <div className="relative w-full h-full animate-popIn">
      <header className="absolute top-0 left-0 p-6 z-10 w-full text-center glass-strong backdrop-blur-xl border-b border-white/10 flex items-center justify-center">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-axiom-accent to-axiom-accent-light bg-clip-text text-transparent">
            La Galaxie
          </h1>
          <p className="text-axiom-text-secondary mt-1">Votre Cortex Visuel</p>
        </div>
        <div className="absolute right-6 top-6">
          <UserMenu />
        </div>
      </header>
      <svg ref={svgRef} className="w-full h-full"></svg>
      <button
        onClick={goBack}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-axiom-accent to-axiom-accent-hover text-white font-bold py-3 px-8 rounded-xl shadow-glow hover:scale-105 transition-all duration-200"
      >
        ← Retour à la Capture
      </button>
    </div>
  );
};
