// src/components/PagePreview.tsx
import type { PageData } from '../data/pageData';

interface PagePreviewProps {
  page: PageData;
  onBack: () => void;
}

export const PagePreview: React.FC<PagePreviewProps> = ({ page, onBack }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-20">
      <div className="text-white font-sans p-8 rounded-lg max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-4">{page.title}</h1>
        <p className="text-xl mb-8">{page.description}</p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Cube
        </button>
      </div>
    </div>
  );
};
