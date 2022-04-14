import { BrowserRouter, Route, Routes } from "react-router-dom";
import Post from "./pages/Post";
import Posts from "./pages/Posts";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/">
					<Route index element={<Posts />} />
					<Route path=":id" element={<Post />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
