import { useLocation, useNavigate } from "solid-app-router";
import { Component, createContext, onMount, Show, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { Loader } from "../components/common/Loader/Loader";
import { ACCESS_TOKEN_KEY } from "../constants/localStorage";
import * as http from "../http/auth";

interface AuthState {
	user: User | null;
	loading: boolean;
}

type AuthStore = [
	AuthState,
	{
		login: Function;
		logout: Function;
	}
];

const initalState = { user: null, loading: true };

const AuthContext = createContext<AuthStore>([initalState, {}] as AuthStore);

const AuthProvider: Component = (props) => {
	const [auth, setAuth] = createStore<AuthState>(initalState);
	const location = useLocation();
	const navigate = useNavigate();

	async function login(userData: { email: string; password: string }) {
		const data = await http.login(userData);
		localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
		const user = await http.getUser();
		setAuth("user", user);
		navigate((location.state as string) ?? "/");
	}

	function logout() {
		setAuth("user", null);
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		navigate((location.state as string) ?? "/");
	}

	function getUser() {}

	onMount(async () => {
		const token = localStorage.getItem(ACCESS_TOKEN_KEY);
		if (!token) {
			setAuth("loading", false);
			return;
		}

		try {
			const data = await http.getUser();
			if (data.status === 401) {
				return;
			}
			setAuth("user", data);
		} catch (err) {}
		setAuth("loading", false);
	});

	const store: AuthStore = [auth, { login, logout }];

	return (
		<Show when={!auth.loading} fallback={<Loader />}>
			<AuthContext.Provider value={store}>
				{props.children}
			</AuthContext.Provider>
		</Show>
	);
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
