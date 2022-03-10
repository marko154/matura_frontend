import { useI18n } from "@amoutonbrady/solid-i18n";
import { useNavigate } from "solid-app-router";
import {
  Component,
  createEffect,
  createResource,
  createSignal,
  For,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { getPatients, Response, QueryParams } from "../../http/patients";
import { formatDate } from "../../utils/strings.utils";
import { Button } from "../common/Button/Button";
import { Input } from "../common/Input/Input";
import { Loader } from "../common/Loader/Loader";
import { MainWrapper } from "../common/MainWrapper";
import { Modal } from "../common/Modal/Modal";
import { Pagination } from "../common/Pagination";
import { Table } from "../common/Table/Table";
import createDebounce from "@solid-primitives/debounce";
import { InlineSelect } from "../common/InlineSelect";
import { Icon } from "../common/Icon";
import { PatientsTable } from "./PatientsTable";
import { PatientsMap } from "./PatientsMap";

const Patients: Component = () => {
  const [t] = useI18n();
  const [viewType, setViewType] = createSignal("table");
  const [params, setParams] = createStore({ page: 1, search: "", limit: 10 });
  const [data, { refetch }] = createResource<Response, QueryParams>(
    () => ({ ...params }),
    getPatients
  );
  const navigate = useNavigate();

  const redirectCreate = () => {
    navigate("/patient/create");
  };

  const [setSearch, clear] = createDebounce(
    (search) => setParams("search", search as string),
    500
  );

  createEffect(() => {
    console.log(data());
    console.log(viewType());
  });

  return (
    <MainWrapper title={t("sidebar.patients")}>
      <div className="flex gap-2">
        <Input
          className="w-80"
          version="secondary"
          placeholder={t("searchBy")}
          onInput={(e) => setSearch(e.currentTarget.value)}
          icon="search"
          autofocus
        />
        <InlineSelect
          onSelect={(type) => setViewType(type)}
          options={[
            { value: "table", content: <Icon name="list" /> },
            { value: "map", content: <Icon name="map" /> },
          ]}
        />
        <Button className="ml-auto" onClick={redirectCreate}>
          {t("patient.createPatient")}
        </Button>
      </div>

      {viewType() === "table" ? <PatientsTable data={data} /> : <PatientsMap />}
    </MainWrapper>
  );
};

export default Patients;
