import renderer from "react-test-renderer";
import SearchPage from "../app/search";
import { mockFirebase } from "firestore-jest-mock";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

mockFirebase({
  database: {
    users: [
      { id: "abc123", name: "Homer Simpson" },
      { id: "abc456", name: "Lisa Simpson" },
    ],
    posts: [{ id: "123abc", title: "Really cool title" }],
  },
});

describe("<StartPage />", () => {
  it("has 1 child", () => {
    const tree = renderer.create(<SearchPage />).toJSON();
    expect(tree.children.length).toBe(1);
  });
});
