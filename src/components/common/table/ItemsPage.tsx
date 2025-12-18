import React from "react";

interface Paginate {
  itemsPerPage: number;
}

interface ItemsPageProps {
  paginate: Paginate;
  fetchFilteredData: (params: { limit: number }) => void;
}

const ItemsPage: React.FC<ItemsPageProps> = ({
  paginate,
  fetchFilteredData,
}) => {
  return (
    <div className="flex flex-row gap-1">
      <label className="text-iconBlack font-medium">Page:</label>
      <select
        value={paginate.itemsPerPage}
        onChange={(e) => fetchFilteredData({ limit: Number(e.target.value) })}
        className="border px-4 text-lg py-2 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 bg-whiteBg text-iconBlack border-secondary"
      >
        {[5, 10, 20, 50, 100].map((items) => (
          <option key={items} value={items}>
            {items}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ItemsPage;
