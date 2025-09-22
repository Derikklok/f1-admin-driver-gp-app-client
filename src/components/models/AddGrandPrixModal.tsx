import React, { useState } from 'react'
import type { GrandPrix as GrandPrixType } from '../../types/driver'
import {
  Button,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogBackdrop,
  Input,
  HStack,
  VStack,
  Text,
  Box,
} from '@chakra-ui/react'

const API = 'http://localhost:5251/api/grandprix'

interface AddGrandPrixModalProps {
  onCreate?: (gp: GrandPrixType) => void
}

export const AddGrandPrixModal: React.FC<AddGrandPrixModalProps> = ({ onCreate }) => {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [laps, setLaps] = useState<number | ''>('')
  const [length, setLength] = useState<number | ''>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setName('')
    setLocation('')
    setLaps('')
    setLength('')
    setError(null)
  }

  const handleCreate = async () => {
    if (!name.trim() || !location.trim() || !laps || !length) {
      setError('Please complete all fields')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, location, laps, length }),
      })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = (await res.json()) as GrandPrixType
  onCreate?.(data)
      reset()
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
      <DialogTrigger asChild>
        <Button colorPalette="teal" variant="solid" className="gp-create-btn">Schedule New Race</Button>
      </DialogTrigger>

  <DialogBackdrop style={{ backgroundColor: 'rgba(0,0,0,0.22)' }} />

  <DialogContent className="gp-modal" style={{ maxWidth: '640px', zIndex: 9999 }}>
        <DialogHeader>
          <Text fontSize="lg" fontWeight="bold">Create Grand Prix</Text>
        </DialogHeader>

        <DialogBody>
          <VStack gap={3} align="stretch">
            {error && <Box className="gp-alert"><Text color="red.600">{error}</Text></Box>}
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="gp-input" />
            <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="gp-input" />
            <HStack gap={3}>
              <Input placeholder="Laps" type="number" value={laps === '' ? '' : String(laps)} onChange={(e) => setLaps(e.target.value === '' ? '' : Number(e.target.value))} className="gp-input" />
              <Input placeholder="Length" type="number" value={length === '' ? '' : String(length)} onChange={(e) => setLength(e.target.value === '' ? '' : Number(e.target.value))} className="gp-input" />
            </HStack>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <HStack gap={3} justify="flex-end">
            <Button variant="outline" onClick={() => { reset(); setOpen(false) }}>Cancel</Button>
            <Button colorPalette="teal" onClick={handleCreate} loading={loading}>{loading ? 'Creating...' : 'Create'}</Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}

export default AddGrandPrixModal
