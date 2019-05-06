/**
 * COMPONENT "THREAD VIEW"
 * 
 * OBJECTIVE:
 * Provide a thread view for a given message.
 * 
 * This is a Mithril.
 */

import { getDriver } from "../drivers/driver.js"
import { getMessageComponent } from "./messages/message.js"

export class ThreadView {
    constructor() {
        this.driver = getDriver()
        this.msgs = []
    }

    async oninit(vnode) {
        let id = "%" + vnode.attrs.msg
        console.log("msg", id)
        this.msgs = await this.driver.thread(id)
        console.log(this.msgs)
        m.redraw()
    }

    view(vnode) {
        let id = "%" + vnode.attrs.msg
        return m("div", [
            m("h1", `Thread: ${id}`),
            m("div.is-message-thread", [
                this.msgs.map(msg => {
                    let key = msg.key
                    return m(getMessageComponent(msg), { key, msg })
                })
            ])
        ])
    }
}
