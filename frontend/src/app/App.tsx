"use client";

import React, { useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { PartyAdd } from "@/components/party-add"
import { CharacterList } from "@/components/character-list"
import { PartyList } from "@/components/party-list"
import { useCharacterStore } from "@/lib/stores/characterStore"
import { usePartyStore } from "@/lib/stores/partyStore"
import { useDungeonStore } from "@/lib/stores/dungeonStore"
import { useAppStore } from "@/lib/stores/appStore"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"


function App() {
    const { activeTab, setActiveTab, setEditingParty } = useAppStore()
  const { fetchCharacterStore, isLoading: charactersLoading, error: charactersError } = useCharacterStore()
  const { fetchPartyStore, isLoading: partiesLoading, error: partiesError } = usePartyStore()
  const { fetchDungeonStore, isLoading: dungeonsLoading, error: dungeonsError } = useDungeonStore()

  useEffect(() => {
    const fetchInitialData = async () => {

      await Promise.all([fetchCharacterStore(), fetchPartyStore(), fetchDungeonStore()])
    }
    fetchInitialData()
  }, [fetchCharacterStore, fetchPartyStore, fetchDungeonStore])

  useEffect(() => {

      if (charactersError) toast("charactersError")
      if (partiesError) toast("partiesError")
      if (dungeonsError) toast("dungeonsError")
  }, [charactersError, partiesError, dungeonsError])

  const handleTabChange = (tab: string) => {
      if (tab === "party-add" && activeTab !== "party-add") {
      } else {
          setEditingParty(null)
      }
      setActiveTab(tab)
  }

  const isLoading = charactersLoading || partiesLoading || dungeonsLoading



  return (
      <DndProvider backend={HTML5Backend}>
        <div className="flex min-h-screen bg-background relative">
          {isLoading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-lg font-medium">로딩 중...</span>
              </div>
            </div>
          )}
          <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
          <main className="flex-1 p-6">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="sticky top-0 bg-white z-10 inline-flex items-center justify-center space-x-6 border-b border-gray-200 mb-6" >
                    <TabsTrigger
                        value="parties"
                        className={`relative pb-2 text-sm font-medium transition-all 
                                ${activeTab === "parties"
                            ? "text-primary border-primary border-b-4"
                            : "text-gray-500 border-transparent border-b-2 hover:text-primary"
                        }`}

                    >

                      <span>파티 리스트</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="characters"
                        className={`relative pb-2 text-sm font-medium transition-all 
                                ${activeTab === "characters"
                            ? "text-primary border-primary border-b-4"
                            : "text-gray-500 border-transparent border-b-2 hover:text-primary"
                        }`}
                    >


                      <span>캐릭터 목록</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="party-add"
                        className={`relative pb-2 text-sm font-medium transition-all 
                                ${activeTab === "party-add"
                            ? "text-primary border-primary border-b-4"
                            : "text-gray-500 border-transparent border-b-2 hover:text-primary"
                        }`}
                    >



                      <span>파티 관리</span>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="parties">
                    <PartyList />
                  </TabsContent>
                  <TabsContent value="characters">
                    <CharacterList />
                  </TabsContent>
                  <TabsContent value="party-add">
                    <PartyAdd />
                  </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </DndProvider>
  )
}

export default App;
