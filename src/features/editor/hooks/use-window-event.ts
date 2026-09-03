import {useEvent} from "react-use";

export const useWindowEvent = () => {
    useEvent("beforeunload", (e) => {
        (e || window.event).returnValue = "Are you sure you want to leave?";
    });
}