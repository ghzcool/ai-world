import * as repositories from "../repositories";
import * as services from "../services";

export default [...Object.keys(repositories), ...Object.keys(services)];
