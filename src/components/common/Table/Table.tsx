import { Component, JSX } from "solid-js";
import "./Table.css";

type TableProps = JSX.IntrinsicElements["table"] & {};

type Table = Component<TableProps> & {
	Header: Component;
	HeaderCell: Component;
	Body: Component;
	Row: Component;
	Cell: Component;
};

export const Table: Table = ({ className = "", ...rest }) => {
	return (
		<table className={`table-auto w-full ${className}`} {...rest}></table>
	);
};

Table.Header = ({ ...rest }) => {
	return <thead className="bg-gray-100 rounded-2xl" {...rest}></thead>;
};

Table.HeaderCell = ({ ...rest }) => {
	return <th className="text-left" {...rest}></th>;
};

Table.Body = ({ ...rest }) => {
	return <tbody {...rest}></tbody>;
};

Table.Row = ({ ...rest }) => {
	return <tr {...rest}></tr>;
};

Table.Cell = ({ ...rest }) => {
	return <td {...rest}></td>;
};
