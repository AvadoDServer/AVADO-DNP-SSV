import axios from "axios";
import useSWR from "swr";
import { server_config } from "../../config"

function get(api_url: string) {
    const fetcher = async (url: string) => await axios.get(url).then((res) => res.data);
    const { data, error } = useSWR(api_url, fetcher);
    return { data: data?.data, error: error };
}
export function useOperatorPublicKey() {
    const api_url: string = `${server_config.monitor_url}/operatorPublicKey`;
    const { data, error } = get(api_url)
    return { data: data as string, error: error };
}

export function useNetwork() {
    const api_url: string = `${server_config.monitor_url}/network`;
    const { data, error } = get(api_url)
    console.log("DDD", data)
    return { data: data as string, error: error };
}