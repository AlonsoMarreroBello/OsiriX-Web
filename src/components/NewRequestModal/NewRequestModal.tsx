import { BaseDataRow } from "../../interfaces/CustomTable.interface";

interface RequestData extends BaseDataRow {
  id: number;
  user: string;
  requestTitle: string;
  requestStatus: string;
  requestDate: string;
}

const NewRequestModal = ({ requestToManage }: { requestToManage: RequestData }) => {
  return (
    <div>
      <h1>Nueva solicitud</h1>
      <p>ID: {requestToManage.id}</p>
      <p>Usuario: {requestToManage.user}</p>
      <p>Solicitud: {requestToManage.requestTitle}</p>
      <p>Estado: {requestToManage.requestStatus}</p>
      <p>Fecha: {requestToManage.requestDate}</p>
    </div>
  );
};

export default NewRequestModal;
