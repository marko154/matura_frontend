import { useParams } from "solid-app-router";
import { Component, createEffect, createResource, createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import { addContacts, getEmergencyContacts } from "../../http/patients";
import { contains, isValidEmail } from "../../utils/strings.utils";
import { Button } from "../common/Button/Button";
import { Input } from "../common/Input/Input";
import { Loader } from "../common/Loader/Loader";
import { Message } from "../common/Message/Message";
import { Modal } from "../common/Modal/Modal";
import { Table } from "../common/Table/Table";
import { toast } from "../common/Toast/Toast";

export const EmergencyContacts: Component = () => {
  const params = useParams();
  const [contacts, { refetch }] = createResource(params.id, getEmergencyContacts);
  const [search, setSearch] = createSignal("");

  const [state, setState] = createStore({
    adding: false,
    contact: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
    },
  });

  const handleChange = (e: any) => {
    setState("contact", e.target.name, e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await addContacts(params.id, [{ ...state.contact, patient_id: Number(params.id) }]);
      setState("adding", false);
      setState("contact", {
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
      });
      refetch();
      toast({ text: "Successfully added" });
    } catch (err) {
      toast({ text: "There was an error" });
    }
  };

  const canSubmit = () => {
    return (
      isValidEmail(state.contact.email) &&
      state.contact.first_name &&
      state.contact.last_name &&
      state.contact.phone_number
    );
  };

  const filtered = () => {
    return contacts()!.filter(
      (contact) =>
        contains(contact.first_name, search()) ||
        contains(contact.last_name, search()) ||
        contains(contact.email || "", search()) ||
        contains(contact.phone_number || "", search())
    );
  };

  return (
    <>
      <div class="flex gap-3 my-6">
        <Input
          version="secondary"
          autofocus
          icon="search"
          className="max-w-xs"
          placeholder="Search for a contact"
          onInput={(e) => setSearch(e.currentTarget.value)}
        />
        <Button className="ml-auto" onClick={() => setState("adding", true)}>
          Add a Contact
        </Button>
      </div>

      {contacts.loading || !contacts() ? (
        <Loader />
      ) : contacts.error ? (
        <Message>An error has occured</Message>
      ) : contacts()!.length === 0 ? (
        <Message>This patient doesn't have any contacts yet</Message>
      ) : filtered().length === 0 ? (
        <Message>No results</Message>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Th>First Name</Table.Th>
              <Table.Th>Last Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone Number</Table.Th>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <For each={filtered()}>
              {(contact) => (
                <Table.Row>
                  <Table.Td class="py-5">{contact.first_name}</Table.Td>
                  <Table.Td class="py-5">{contact.last_name}</Table.Td>
                  <Table.Td class="py-5">{contact.email}</Table.Td>
                  <Table.Td class="py-5">{contact.phone_number}</Table.Td>
                </Table.Row>
              )}
            </For>
          </Table.Body>
        </Table>
      )}

      <Modal open={state.adding} onClose={() => setState("adding", false)}>
        <h3 class="text-xl mb-4 font-bold">Add an Emergency Contact</h3>
        <form>
          <div class="flex flex-col gap-2">
            <div class="flex gap-2">
              <Input
                version="secondary"
                label="First Name"
                onInput={handleChange}
                name="first_name"
              />
              <Input
                version="secondary"
                label="Last Name"
                onInput={handleChange}
                name="last_name"
              />
            </div>
            <Input
              type="email"
              label="Email"
              name="email"
              version="secondary"
              onInput={handleChange}
            />
            <Input
              type="tel"
              label="Phone Number"
              version="secondary"
              name="phone_number"
              onInput={handleChange}
            />
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <Button action="secondary" onClick={() => setState("adding", false)}>
              Cancel
            </Button>
            <Button disabled={!canSubmit()} onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
