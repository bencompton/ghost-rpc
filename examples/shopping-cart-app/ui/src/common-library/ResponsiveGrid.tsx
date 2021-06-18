import * as React from 'react';
import MediaQuery from 'react-responsive';

interface IDynamicGridProps extends React.Props<any> {
  rowElement: (columnCount?: number) => React.ReactElement<any>;
  columnElement: (columnCount?: number) => React.ReactElement<any>;
  columns: number;
}

const DynamicGrid = (props: IDynamicGridProps) => {
  const children = React.Children.toArray(props.children);
  const rowElements: React.ReactElement<any>[] = [];
  let currentChildIndex = 0;

  while (currentChildIndex < children.length) {
    const columnElements: React.ReactElement<any>[] = [];

    for (let i = 0; i < props.columns; i++) {
      const child = children[currentChildIndex];
      columnElements.push(
        React.cloneElement(
          props.columnElement(props.columns), { key: `col-${currentChildIndex}`, children: child }
        )
      );

      currentChildIndex++;
    }

    rowElements.push(
      React.cloneElement(
        props.rowElement(props.columns), { key: `row-${currentChildIndex}`, children: columnElements }
      )
    );
  }

  return <>{rowElements}</>;
};

export interface IColumnQueries {
  [query: string]: number;
}

export interface IResponsiveGridProps extends React.Props<any> {
  columnQueries: IColumnQueries;
  rowElement: (columnCount?: number) => React.ReactElement<any>;
  columnElement: (columnCount?: number) => React.ReactElement<any>;
}

export default (props: any) => {
  const responsiveElements = Object.keys(props.columnQueries).map((query) => {
    const columnCount = props.columnQueries[query];

    return (
      <MediaQuery query={query} key={query}>
        <DynamicGrid
          columns={columnCount}
          rowElement={props.rowElement}
          columnElement={props.columnElement}
        >
          {props.children}
        </DynamicGrid>
      </MediaQuery>
    );
  });

  return <>{responsiveElements}</>;
};
