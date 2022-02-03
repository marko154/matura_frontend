import { createStore } from "solid-js/store";
import { Button } from "./common/Button/Button";
import { Input } from "./common/Input/Input";
import { useI18n } from "@amoutonbrady/solid-i18n";
import * as auth from "../http/auth";
import { Link } from "solid-app-router";

const SignUp = () => {
	const [t] = useI18n();

	const [state, setState] = createStore({
		email: "marko.gartnar777@gmail.com",
		password: "",
		confirmPassword: "",
		error: false,
	});

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			const user = await auth.register(state);
		} catch (err) {
			setState("error", true);
		}
	};

	const handleChange = (e: any) => {
		const { value, name } = e.currentTarget;
		setState(name, value);
	};

	const isValid = () => {
		return (
			state.confirmPassword === state.password &&
			state.password.length > 0 &&
			state.email.length > 0
		);
	};

	const handleGoogleSignup = () => {};

	return (
		<div className="flex justify-center w-full h-full items-center">
			<div className="w-11/12 max-w-sm">
				<h1 className="text-4xl text-primary uppercase">
					{t("signup")}
				</h1>
				<form className="mt-10">
					<div className="flex flex-col gap-3">
						<Input
							type="text"
							onInput={handleChange}
							value={state.email}
							label={t("email")}
							name="email"
						/>
						<Input
							type="password"
							onInput={handleChange}
							value={state.password}
							name="password"
							label={t("password")}
							required
						/>
						<Input
							type="password"
							onInput={handleChange}
							value={state.confirmPassword}
							name="confirmPassword"
							label={t("confirmPassword")}
							required
						/>
					</div>
					<Button
						className="w-full mt-14"
						onClick={handleSubmit}
						disabled={!isValid()}
					>
						{t("signup")}
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
						{t("alreadyHaveAcc")}&nbsp;
						<Link href="/signin" className="text-blue-700">
							{t("signin")}
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
