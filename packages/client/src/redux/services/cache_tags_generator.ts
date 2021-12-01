import { EntityId, EntityState } from '@reduxjs/toolkit';

export const providesListTags = <R extends { id: EntityId }[], T extends string>(
  resultsWithIds: R | undefined,
  tagType: T
) =>
  resultsWithIds
    ? [{ type: tagType, id: 'LIST' }, ...resultsWithIds.map(({ id }) => ({ type: tagType, id }))]
    : [{ type: tagType, id: 'LIST' }];

export const providesEntitiesTags = <R extends { id: EntityId }, T extends string>(
  resultsWithIds: EntityState<R> | undefined,
  tagType: T
) =>
  resultsWithIds
    ? [{ type: tagType, id: 'LIST' }, ...resultsWithIds.ids.map((id) => ({ type: tagType, id }))]
    : [{ type: tagType, id: 'LIST' }];

export const providesTag = <R extends { id: EntityId }, T extends string>(resultsWithId: R | undefined, tagType: T) =>
  resultsWithId ? [{ type: tagType, id: resultsWithId.id }] : [{ type: tagType }];
