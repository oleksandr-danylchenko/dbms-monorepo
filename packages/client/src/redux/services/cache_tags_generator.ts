export const providesEntitiesListTags = <R extends { id: string | number }[], T extends string>(
  resultsWithIds: R | undefined,
  tagType: T
) =>
  resultsWithIds
    ? [{ type: tagType, id: 'LIST' }, ...resultsWithIds.map(({ id }) => ({ type: tagType, id }))]
    : [{ type: tagType, id: 'LIST' }];

export const providesEntityTag = <R extends { id: string | number }, T extends string>(
  resultsWithId: R | undefined,
  tagType: T
) => (resultsWithId ? [{ type: tagType, id: resultsWithId.id }] : [{ type: tagType }]);
