import { useDispatch } from "react-redux";
import { setLoading, setGroups, addOrReplaceGroup, removeGroup } from "./groupSlice";
import axiosAPI from "../../axios";
import { toast } from "sonner";


const useGroup = () => {
    const dispatch = useDispatch();

    const fetchGroups = async () => {

         dispatch(setLoading('fetchGroups'));
        try {
            const response = await axiosAPI.get("api/getGroups/");
             console.log(response.data.data)
            dispatch(setGroups(response.data.data))
            dispatch(setLoading(''));

        } catch (e) {
            dispatch(setLoading(''));
        }

    };

    const postGroup = async (data) => {
        dispatch(setLoading('postGroup'));
        try {
            const response = await axiosAPI.post("api/createGroup/", data);
            
            dispatch(setLoading(''));
            
            dispatch(addOrReplaceGroup(response.data.group))
            toast.success("Group Added successful", {
                duration: 3000
            });
        } catch (e) {
            dispatch(setLoading(''));

            toast.error("Failed ", {
                description: "Somthing went Worng",
                duration: 3000
            });
        }
    };

    const postGroupExpense = async (expenseData) => {
          dispatch(setLoading("postMember"))
        try {
            const response = await axiosAPI.post("api/addGroupExpense/", expenseData);
            
            dispatch(addOrReplaceGroup(response.data.group))

            dispatch(setLoading(''));

            toast.success(response.data.message, {
                duration: 3000
            });
        } catch (e) {
            dispatch(setLoading(''));
            toast.error("Failed ", {
                description: e.response.data.error,
                duration: 3000
            });
        }
    };

    const postMember = async ({email,group}) => {
        dispatch(setLoading("postMember"))
        try {
            const response = await axiosAPI.post("api/addGroupMember/", {"email":email,"group_id":group.id});
            
            dispatch(setLoading(''));
            
            dispatch(addOrReplaceGroup(response.data.group))


            toast.success(response.data.message, {
                duration: 3000
            });
        } catch (e) {
            dispatch(setLoading(''));
             
            toast.error("Failed ", {
                   description: e.response.data.error,
                duration: 3000
            });
        }
        
    };

    const deleteGroup = async (groupId) => {
        dispatch(setLoading("deleteGroup"));
        try {
            await axiosAPI.delete(`api/deleteGroup/${groupId}/`);
            
            dispatch(setLoading(''));
            dispatch(removeGroup(groupId));

            toast.success("Group deleted successfully", {
                duration: 3000
            });
        } catch (e) {
            dispatch(setLoading(''));
            toast.error("Failed to delete group", {
                description: e.response?.data?.error || "Something went wrong",
                duration: 3000
            });
        }
    };

   
    return { 
        fetchGroups, 
        postGroup, 
        postGroupExpense, 
        postMember, 
        deleteGroup, 
    
    };
};

export default useGroup;


