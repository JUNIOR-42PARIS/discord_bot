import create from './intercationCreate';
import ready from './ready';
import deploy from './deploy';

type Event = {
	name: string,
	once?: boolean,
	execute: (...args: any) => void
}

const events: Event[] = [
	create, ready, deploy,
];

export default events;