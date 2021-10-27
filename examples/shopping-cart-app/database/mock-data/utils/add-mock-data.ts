import { Connection, EntityTarget } from 'typeorm';

export default async <EntityType>(
  connection: Connection,
  entity: EntityTarget<EntityType>,
  data: EntityType[]
) => {
  const chunk =  1000;

  for(let i = 0, j = data.length; i < j; i += chunk) {
    await connection
      .createQueryBuilder()
      .insert()
      .into(entity)
      .values(data.slice(i, i + chunk))
      .execute();
  }
};