"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface SizeGuideModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [measurements, setMeasurements] = useState({
    bust: "",
    waist: "",
    hips: "",
    inseam: "",
  })
  const { toast } = useToast()

  const handleSaveMeasurements = () => {
    if (!measurements.bust || !measurements.waist || !measurements.hips || !measurements.inseam) {
      toast({
        title: "Please fill in all measurements",
        description: "All measurement fields are required for your custom fit.",
        variant: "destructive",
      })
      return
    }

    localStorage.setItem("userMeasurements", JSON.stringify(measurements))
    toast({
      title: "Measurements saved!",
      description: "Your custom measurements have been saved to your profile.",
    })
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-center">Find Your Custom Fit</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bust" className="text-sm font-medium">
                  Bust (inches)
                </Label>
                <Input
                  id="bust"
                  type="number"
                  placeholder="34"
                  value={measurements.bust}
                  onChange={(e) => handleInputChange("bust", e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waist" className="text-sm font-medium">
                  Waist (inches)
                </Label>
                <Input
                  id="waist"
                  type="number"
                  placeholder="26"
                  value={measurements.waist}
                  onChange={(e) => handleInputChange("waist", e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hips" className="text-sm font-medium">
                  Hips (inches)
                </Label>
                <Input
                  id="hips"
                  type="number"
                  placeholder="36"
                  value={measurements.hips}
                  onChange={(e) => handleInputChange("hips", e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inseam" className="text-sm font-medium">
                  Inseam (inches)
                </Label>
                <Input
                  id="inseam"
                  type="number"
                  placeholder="30"
                  value={measurements.inseam}
                  onChange={(e) => handleInputChange("inseam", e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            <Button onClick={handleSaveMeasurements} className="w-full h-12 text-base font-medium">
              Save Measurements
            </Button>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative">
              <svg
                width="280"
                height="400"
                viewBox="0 0 280 400"
                className="text-muted-foreground"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Body outline */}
                <path
                  d="M140 50 C120 50, 110 60, 110 80 L110 120 C105 125, 100 130, 100 140 L100 180 C100 190, 105 195, 110 200 L110 240 C110 250, 115 255, 120 260 L120 320 C120 330, 125 335, 130 340 L130 380 M140 50 C160 50, 170 60, 170 80 L170 120 C175 125, 180 130, 180 140 L180 180 C180 190, 175 195, 170 200 L170 240 C170 250, 165 255, 160 260 L160 320 C160 330, 155 335, 150 340 L150 380"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  fill="none"
                />

                {/* Head */}
                <circle cx="140" cy="35" r="15" stroke="currentColor" strokeWidth="1.5" fill="none" />

                {/* Arms */}
                <path d="M110 100 L80 120 L75 160" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M170 100 L200 120 L205 160" stroke="currentColor" strokeWidth="1.5" fill="none" />

                {/* Legs */}
                <path d="M130 340 L125 380" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M150 340 L155 380" stroke="currentColor" strokeWidth="1.5" fill="none" />

                {/* Measurement lines and labels */}

                {/* Bust measurement */}
                <line x1="85" y1="120" x2="195" y2="120" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="85" cy="120" r="2" fill="currentColor" />
                <circle cx="195" cy="120" r="2" fill="currentColor" />
                <text x="240" y="125" className="text-xs fill-current" fontSize="12">
                  Bust
                </text>
                <line x1="200" y1="120" x2="235" y2="120" stroke="currentColor" strokeWidth="0.5" />

                {/* Waist measurement */}
                <line x1="90" y1="160" x2="190" y2="160" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="90" cy="160" r="2" fill="currentColor" />
                <circle cx="190" cy="160" r="2" fill="currentColor" />
                <text x="240" y="165" className="text-xs fill-current" fontSize="12">
                  Waist
                </text>
                <line x1="195" y1="160" x2="235" y2="160" stroke="currentColor" strokeWidth="0.5" />

                {/* Hips measurement */}
                <line x1="95" y1="200" x2="185" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="95" cy="200" r="2" fill="currentColor" />
                <circle cx="185" cy="200" r="2" fill="currentColor" />
                <text x="240" y="205" className="text-xs fill-current" fontSize="12">
                  Hips
                </text>
                <line x1="190" y1="200" x2="235" y2="200" stroke="currentColor" strokeWidth="0.5" />

                {/* Inseam measurement */}
                <line x1="140" y1="200" x2="140" y2="340" stroke="currentColor" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="140" cy="200" r="2" fill="currentColor" />
                <circle cx="140" cy="340" r="2" fill="currentColor" />
                <text x="145" y="275" className="text-xs fill-current" fontSize="12">
                  Inseam
                </text>
              </svg>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { SizeGuideModal }
