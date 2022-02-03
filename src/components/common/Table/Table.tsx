import { Component, JSX } from "solid-js";
import "./Table.css";

type TableProps = JSX.IntrinsicElements["table"] & {};

type Table = Component<TableProps> & {
	Header: Component<JSX.IntrinsicElements["thead"]>;
	Th: Component<JSX.IntrinsicElements["th"]>;
	Body: Component<JSX.IntrinsicElements["tbody"]>;
	Row: Component<JSX.IntrinsicElements["tr"]>;
	Td: Component<JSX.IntrinsicElements["td"]>;
};

export const Table: Table = (props) => {
	return <table {...props}></table>;
};

Table.Header = (props) => {
	return <thead {...props}></thead>;
};

Table.Th = (props) => {
	return <th {...props}></th>;
};

Table.Body = (props) => {
	return <tbody {...props}></tbody>;
};

Table.Row = (props) => {
	return <tr {...props}></tr>;
};

Table.Td = (props) => {
	return <td {...props}></td>;
};
