import { useRef } from "preact/hooks";
import useSWR from "swr";
import { JSONSchema7 } from "json-schema";
import { FacetsResponse } from "../clients/vtex/intelligentSearch.ts";
import FacetsTree from "../components/search/FacetsTree.tsx";
import SortSelector from "../components/search/SortSelector.tsx";
import Modal from "../components/ui/Modal.tsx";

export const schema: JSONSchema7 = {
  title: "SearchControls",
  type: "object",
  properties: {},
};


export default function SearchControls() {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  // Fetching facets
  const facetsFetcher = () => {
    const urlSearchParams = new URLSearchParams(window.location?.search);

    return fetch(`/api/searchFacets?${urlSearchParams.toString()}`).then((r) =>
      r.json()
    );
  };

  const { data } = useSWR<FacetsResponse, Error>(
    `facets-TODO`,
    facetsFetcher,
    {}
  );

  // TODO: Standardize max-width (1400px)
  return (
    <div class="flex justify-center flex-row">
      <div class="flex justify-around md:justify-between items-center px-4 py-2 max-w-[1400px] flex-1">
        <div>
          <button
            onClick={() => modalRef.current!.showModal()}
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green-light"
          >
            Filtros
          </button>
        </div>
        <div class="md:flex flex-col justify-center hidden">
          <h2 class="text-center text-sm md:text-2xl">
            Resultados da Busca
          </h2>
        </div>
        <div class="flex flex-row justify-end">
          <SortSelector />
        </div>
      </div>
      <Modal title="Selecione os filtros" mode="sidebar-left" ref={modalRef}>
        {data ? <FacetsTree facetsResponse={data} /> : "loading..."}
      </Modal>
    </div>
  );
}
