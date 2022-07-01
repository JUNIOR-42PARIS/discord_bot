import auth from './auth';
import help  from './help';
import info from './info';
import { Collection } from 'discord.js';

const collection = new Collection<string, any>();

collection.set(auth.data.name, auth);
collection.set(help.data.name, help);
collection.set(info.data.name, info);

export default collection;