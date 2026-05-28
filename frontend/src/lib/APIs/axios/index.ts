import interceptors from "./interceptors.axios";
import instance from "./instance.axios";

interceptors(instance);

export default instance;
