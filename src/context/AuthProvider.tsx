import { useLocation, useNavigate } from "solid-app-router";
import {
	Component,
	createContext,
	Match,
	onMount,
	Show,
	Switch,
	useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Loader } from "../components/common/Loader/Loader";
import { ACCESS_TOKEN_KEY } from "../constants/localStorage";
import * as http from "../http/auth";

interface AuthState {
	user: User | null;
	loading: boolean;
	error: string | null;
}

type AuthStore = [
	AuthState,
	{
		login: (userData: { email: string; password: string }) => Promise<void>;
		logout: () => void;
		googleLogin: () => void;
	}
];

const initalState = { user: null, loading: true, error: null };

const AuthContext = createContext<AuthStore>([initalState, {}] as AuthStore);

const AuthProvider: Component = (props) => {
	const [auth, setAuth] = createStore<AuthState>(initalState);
	const location = useLocation();
	const navigate = useNavigate();

	async function getUserAndRedirect(token: string) {
		localStorage.setItem(ACCESS_TOKEN_KEY, token);
		const user = await http.getUser();
		setAuth("user", user);
		navigate((location.state as string) ?? "/");
	}

	async function login(userData: { email: string; password: string }) {
		const data = await http.login(userData);
		await getUserAndRedirect(data.token);
	}

	async function googleLogin() {
		const GoogleAuth = gapi.auth2.getAuthInstance();
		const res = await GoogleAuth.signIn();
		const { id_token } = res.getAuthResponse();
		try {
			const data = await http.googleLogin(id_token);
			console.log(data);
			await getUserAndRedirect(data.token);
		} catch (err) {
			setAuth("error", String(err));
		}
	}

	function logout() {
		setAuth("user", null);
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		navigate((location.state as string) ?? "/");
	}

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

	const store: AuthStore = [auth, { login, logout, googleLogin }];

	return (
		<Switch fallback={<Loader />}>
			<Match when={!auth.error && !auth.loading}>
				<AuthContext.Provider value={store}>
					{props.children}
				</AuthContext.Provider>
			</Match>

			<Match when={auth.error}>
				<h1>There was an error. {auth.error} </h1>
			</Match>
		</Switch>
	);
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
