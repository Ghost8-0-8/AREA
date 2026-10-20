import { Schema, model } from "mongoose";
import IArea from "./areaSchema";

const AreaSchema = new Schema<IArea>({
    user_id : {
        type : String,
        required : true
    },
    action : {
        type : Object,
        required : true
    },
    reaction : {
        type : Object,
        required : true
    }
});

const AreaModel = model<IArea>("Area", AreaSchema);
export default AreaModel;
