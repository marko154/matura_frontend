import { Component, JSX } from "solid-js";

type TableProps = JSX.IntrinsicElements["table"] & {};

type Table = Component<TableProps> & {
	Header: Component;
	HeaderCell: Component;
	Body: Component;
	Row: Component;
	Cell: Component;
};

export const Table: Table = ({ ...rest }) => {
	return <table {...rest}></table>;
};

Table.Header = ({ ...rest }) => {
	return <thead {...rest}></thead>;
};

Table.HeaderCell = ({ ...rest }) => {
	return <th {...rest}></th>;
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
