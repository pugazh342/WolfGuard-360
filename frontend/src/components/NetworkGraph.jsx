import React, { useMemo, useRef, useEffect, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d'; // <--- Removed the curly braces here!
import { Network } from 'lucide-react';

const NetworkGraph = ({ assets }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(800);

  // Automatically resize the graph to fit our dashboard
  useEffect(() => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
    }
  }, [assets]);

  // Translate our Asset data into Nodes and Links
  const graphData = useMemo(() => {
    const nodes = [];
    const links = [];

    assets.forEach((asset) => {
      // 1. Create the Main Domain Node (Big and Blue)
      nodes.push({ id: asset.domain, name: asset.domain, group: 'domain', val: 20, color: '#3b82f6' });

      // 2. Create the IP Node (Medium and Red)
      if (asset.ip_address) {
        const ipId = `ip-${asset.ip_address}`;
        if (!nodes.find(n => n.id === ipId)) {
          nodes.push({ id: ipId, name: asset.ip_address, group: 'ip', val: 10, color: '#ef4444' });
        }
        // Link the Domain to the IP
        links.push({ source: asset.domain, target: ipId });
      }

      // 3. Create Subdomain Nodes (Small and Emerald)
      if (asset.subdomains && asset.subdomains.length > 0) {
        asset.subdomains.forEach((sub) => {
          if (!nodes.find(n => n.id === sub)) {
            nodes.push({ id: sub, name: sub, group: 'subdomain', val: 5, color: '#10b981' });
          }
          // Link the Subdomain to the Main Domain
          links.push({ source: sub, target: asset.domain });
        });
      }
    });

    return { nodes, links };
  }, [assets]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-400">
        <Network className="w-5 h-5" /> Topology Map
      </h2>
      <div 
        ref={containerRef} 
        className="w-full h-[400px] bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-inner flex items-center justify-center cursor-move"
      >
        {assets.length === 0 ? (
          <p className="text-slate-500">Awaiting targets to map network topology...</p>
        ) : (
          <ForceGraph2D
            width={width}
            height={400}
            graphData={graphData}
            nodeLabel="name"
            nodeColor="color"
            linkColor={() => '#334155'} // Dark gray lines
            // Draws a glowing ring around nodes when hovered
            nodeCanvasObjectMode={() => 'after'}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.name;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(label, node.x, node.y + 12); // Put text slightly below the node
            }}
          />
        )}
      </div>
    </div>
  );
};

export default NetworkGraph;