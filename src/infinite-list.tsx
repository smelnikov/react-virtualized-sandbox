import { useRef, useEffect } from "react";
import {
  type IndexRange,
  InfiniteLoader,
  List,
  Index,
  ListRowProps,
} from "react-virtualized";

export function InfiniteList({
  className,
  hasMore,
  isLoading,
  items,
  fetchNext,
  searchTerm,
}: {
  className: string;
  hasMore: boolean;
  isLoading: boolean;
  items: Array<{ name: string }>;
  fetchNext: (params: IndexRange) => Promise<void>;
  searchTerm: string;
}) {
  const listRef = useRef<InfiniteLoader>(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    // reset cache when filter changes
    if (listRef.current && hasMountedRef.current) {
      listRef.current.resetLoadMoreRowsCache();
    }
    hasMountedRef.current = true;
  }, [searchTerm]);

  const rowCount = hasMore ? items.length + 1 : items.length;
  const loadMoreRows = isLoading ? () => Promise.resolve() : fetchNext;
  const isRowLoaded = ({ index }: Index) => !hasMore || index < items.length;

  const rowRenderer = ({ index, key, style }: ListRowProps) => {
    let content;
    if (!isRowLoaded({ index })) {
      content = "Loading...";
    } else {
      content = items[index].name;
    }

    return (
      <div key={key} style={style}>
        {content}
      </div>
    );
  };

  return (
    <InfiniteLoader
      ref={listRef}
      isRowLoaded={isRowLoaded}
      rowCount={rowCount}
      loadMoreRows={loadMoreRows}
    >
      {({ onRowsRendered, registerChild }) => (
        <List
          className={className}
          height={150}
          itemSize={30}
          onRowsRendered={onRowsRendered}
          ref={registerChild}
          rowCount={rowCount}
          rowHeight={30}
          rowRenderer={rowRenderer}
          width={450}
        />
      )}
    </InfiniteLoader>
  );
}
