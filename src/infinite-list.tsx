import { useRef, useEffect } from "react";
import {
  type IndexRange,
  InfiniteLoader,
  List,
  Index,
  ListRowProps,
  WindowScroller,
  AutoSizer,
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
    <AutoSizer disableHeight>
      {({ width }) => (
        <WindowScroller>
          {({ height, onChildScroll, scrollTop }) => (
            <InfiniteLoader
              ref={listRef}
              isRowLoaded={isRowLoaded}
              rowCount={rowCount}
              loadMoreRows={loadMoreRows}
            >
              {({ onRowsRendered, registerChild }) => (
                <List
                  autoHeight
                  className={className}
                  height={height}
                  onRowsRendered={onRowsRendered}
                  ref={registerChild}
                  rowCount={rowCount}
                  onScroll={onChildScroll}
                  rowHeight={42}
                  scrollTop={scrollTop}
                  rowRenderer={rowRenderer}
                  width={width}
                />
              )}
            </InfiniteLoader>
          )}
        </WindowScroller>
      )}
    </AutoSizer>
  );
}
