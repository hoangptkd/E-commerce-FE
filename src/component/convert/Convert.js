import {format, parseISO} from "date-fns";
export const ConvertTimeStamp = ({timestamp})=> {
    const date = parseISO(timestamp)
    return format(date, 'yyyy-MM-dd HH:mm:ss')

}
export const ConvertAddress = ({address})=> {
    if (!address) return null;
    const formatedAddress = address.street + ", " + address.district + ", " + address.city
    return formatedAddress
}