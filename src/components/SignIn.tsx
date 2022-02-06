import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { useI18n } from "@amoutonbrady/solid-i18n";
import { useAuth } from "./../context/AuthProvider";
import { isValidEmail } from "./../utils/strings.utils";

import { Button } from "./common/Button/Button";
import { Input } from "./common/Input/Input";
import { Link } from "solid-app-router";

const SignIn: Component = () => {
	const [t] = useI18n();
	const [, { login, googleLogin }] = useAuth();

	const [state, setState] = createStore({
		email: "marko.gartnar777@gmail.com",
		password: "",
		error: false,
		loading: false,
	});

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setState("loading", true);
		try {
			await login({
				email: state.email,
				password: state.password,
			});
		} catch (err: any) {
			console.log(err);
			setState("error", true);
		} finally {
			setState("loading", false);
		}
	};

	const handleChange = (e: any) => {
		const { value, name } = e.currentTarget;
		setState(name, value);
	};

	const isValid = () => {
		return (
			state.email.length > 0 &&
			isValidEmail(state.email) &&
			state.password.length > 0
		);
	};

	const handleGoogleSignup = () => {
		googleLogin();
	};

	return (
		<div className="flex justify-center w-full h-full items-center">
			<div className="w-11/12 max-w-sm">
				<h1 className="text-4xl text-primary uppercase">
					{t("signin")}
				</h1>
				<form className="mt-10">
					<div className="flex flex-col gap-3">
						<Input
							type="text"
							onInput={handleChange}
							value={state.email}
							label={t("email")}
							disabled={state.loading}
							name="email"
						/>
						<Input
							type="password"
							onInput={handleChange}
							value={state.password}
							name="password"
							label={t("password")}
							disabled={state.loading}
							required
						/>
					</div>
					<Button
						className="w-full mt-14"
						onClick={handleSubmit}
						disabled={!isValid() || state.loading}
						loading={state.loading}
					>
						{t("signin")}
					</Button>
					<Button
						className="w-full mt-2"
						onClick={handleGoogleSignup}
						action="google"
						type="button"
					>
						{t("continueWithGoogle")}
					</Button>

					<div className="text-center text-primary mt-3">
						{t("dontHaveAcc")}&nbsp;
						<Link href="/signup" className="text-blue-700">
							{t("signup")}
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignIn;
