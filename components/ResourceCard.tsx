
import React from 'react';
import { Resource } from '../types';

interface ResourceCardProps {
    resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <img className="w-full h-40 object-cover" src={resource.imageUrl} alt={resource.title} />
            <div className="p-4">
                <span className="text-xs font-semibold text-brand-secondary bg-brand-light px-2 py-1 rounded-full">{resource.category}</span>
                <h3 className="text-lg font-bold text-brand-dark mt-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                <button className="text-sm font-semibold text-brand-primary mt-4 hover:underline">
                    Read More &rarr;
                </button>
            </div>
        </div>
    );
};

export default ResourceCard;