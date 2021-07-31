import { ChildProcess } from "child_process"


export type SharedData = {
    can_frames: CANFrame[],
    serial_worker?: ChildProcess,
    serial_virtual_n?: NodeJS.Timeout,
    methods: {}
}

export type CANFrame = {
    str:string,
    dev_id:number,
    time:number,
    data: {
        b16:string,
        raw_full:number,
        raw_bytes:number[],
        nbits:number,

    }
}

