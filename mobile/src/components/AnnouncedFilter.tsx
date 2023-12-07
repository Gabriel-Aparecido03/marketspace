import { Box, HStack, Select, Text } from "native-base";
import React, { useState } from "react";

type AnnouncedFilterTypeParams = {
  onChange : (value:string) => void
  numberOfAnnounceds : number
}

export function AnnouncedFilter({ numberOfAnnounceds,onChange  }:AnnouncedFilterTypeParams){

  const [ filter , setFilter ] = useState('all')

  return (
    <HStack justifyContent={"space-between"} alignItems={"center"}>
      <Text fontSize={"md"} color={"gray.200"}> { numberOfAnnounceds } announceds</Text>
      <Select onValueChange={e => { 
        onChange(e)
        setFilter(e)
      }} selectedValue={filter} w={"32"}>
        <Select.Item label="all" value="all" />
        <Select.Item label="active" value="actived" />
        <Select.Item label="disable" value="disabled" />
      </Select>
    </HStack>
  )
}