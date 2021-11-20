export interface NormalizationEntity {
  id: string;
}

export interface NormalizedEntity<T> {
  [id: string]: T;
}

export const normalize = <T extends NormalizationEntity>(entities: T[]): NormalizedEntity<T> =>
  entities.reduce((index, entity) => {
    index[entity.id] = entity;
    return index;
  }, {} as NormalizedEntity<T>);

export const denormalize = <T extends NormalizationEntity>(entitiesIndex: NormalizedEntity<T>): T[] =>
  Object.values(entitiesIndex);

export const getIds = <T extends NormalizationEntity>(entitiesIndex: NormalizedEntity<T>): string[] =>
  Object.keys(entitiesIndex);
