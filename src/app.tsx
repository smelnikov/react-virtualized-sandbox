import { useState } from "react";
import faker, { name } from "faker";
import "./app.css";
import { InfiniteList } from "./infinite-list";

faker.seed(123);
const randomPersons = new Array(999)
  .fill(true)
  .map(() => ({ name: name.findName() }));

export function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Array<{ name: string }>>([]);
  const hasMore = items.length < 1000;

  return (
    <>
      <h1>Infinite loader</h1>

      <input
        className="input"
        type="text"
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setItems([]);
        }}
      />
      <span className="help-text">Change value to reset list cache</span>

      <InfiniteList
        className="infinite-list"
        hasMore={hasMore}
        isLoading={isLoading}
        searchTerm={searchTerm}
        items={items}
        fetchNext={({ startIndex }) => {
          setIsLoading(true);
          return new Promise<void>((resolve) => {
            setTimeout(() => {
              setItems((prev) =>
                prev.concat(randomPersons.slice(startIndex, startIndex + 10)),
              );
              setIsLoading(false);
              resolve();
            }, 500);
          });
        }}
      />
    </>
  );
}
