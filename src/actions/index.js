import * as home from './home';
import * as auth from './auth';
import * as topic from './topic';
import * as reply from './reply';

export default {
	...home,
	...auth,
	...topic,
	...reply
};
