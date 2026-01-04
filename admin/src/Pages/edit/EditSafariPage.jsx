import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SearchSafari from "../search/SearchSafari";
import EditSafari from "./EditSafari";

const EditSafariPage = () => {
  const { id } = useParams();
  const [selectedSafariId, setSelectedSafariId] = useState(null);

  // If the page is opened via direct URL with :id, use it
  useEffect(() => {
    if (id) setSelectedSafariId(id);
  }, [id]);

  return (
    <div className="p-6">
      <SearchSafari onEditSelect={setSelectedSafariId} />

      {selectedSafariId && <EditSafari safariId={selectedSafariId} />}
    </div>
  );
};

export default EditSafariPage;
