"use client"

import { Provider } from "react-redux"
import { store } from "@/store/store"
import { RPGCombat } from "@/components/RPGCombat"

export default function Home() {
  return (
    <Provider store={store}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gray-900">
        <RPGCombat />
        <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">TODO:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>How to handle KI Beam Clash, or just clash in general. </li>
            <li>Support Multi-target ki moves. </li>
            <li>Support for Bleed attack types & items. </li>
            <li>Add a fight resolution screen that helps refs finalize the update math. </li>
            <li>Add more tricky special moves. </li>
            <li>
              Add the following moves: Body Change, Controllable Destruco Disc, Dead Zone, Destructo Disc, Ki Barrier,
              Power Ball, Regeneration, Solar Flare, Spirit Bomb, Time Freeze, Tri Form, Kaiouken.{" "}
            </li>
            <li>Add ref cheat to increase/decrease upcoming defense chance by target fighter. </li>
            <li>Add ref cheat to append moves/transformations.</li>
            <li>Add ref cheat to append a Fight Log entry; manual entry for logging notes.</li>
          </ul>
        </div>
      </main>
    </Provider>
  )
}
