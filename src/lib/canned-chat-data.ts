
export interface CannedResponse {
  question: string;
  answer: string;
}

export const cannedResponses: CannedResponse[] = [
  {
    question: "What is an Argo float?",
    answer: `An **Argo float** is a robotic instrument that drifts with ocean currents and measures temperature, salinity, and other parameters. These floats periodically change their buoyancy to surface, transmit data to satellites, and then sink again to repeat the cycle. The global array of over 4,000 floats provides real-time data on the state of the upper ocean.`
  },
  {
    question: "Compare BGC parameters in Arabian Sea vs. Bay of Bengal",
    answer: `Oceanographers have noted key differences between these two regions:
*   **Salinity:** The Arabian Sea is typically more saline due to higher evaporation rates and less freshwater input compared to the Bay of Bengal, which receives massive river discharges.
*   **Oxygen:** The Arabian Sea hosts one of the world's most intense Oxygen Minimum Zones (OMZs), whereas the Bay of Bengal's OMZ is generally less severe.
*   **Chlorophyll:** The Arabian Sea often exhibits intense seasonal phytoplankton blooms, particularly during the monsoon seasons, leading to higher chlorophyll concentrations than typically found in the Bay of Bengal.`
  },
  {
    question: "What is a CTD sensor?",
    answer: `A **CTD sensor** is a primary instrument on Argo floats that measures **C**onductivity, **T**emperature, and **D**epth. From these three direct measurements, scientists can calculate salinity and density, which are fundamental to understanding ocean circulation and water mass properties.`
  },
  {
    question: "Explain the concept of a 'thermocline'.",
    answer: `The **thermocline** is a distinct layer in a large body of fluid (like an ocean) in which temperature changes more rapidly with depth than it does in the layers above or below. In the ocean, the thermocline separates the warmer, mixed upper layer from the colder, deep water layer.`
  },
  {
    question: "What does 'salinity' measure?",
    answer: `**Salinity** measures the concentration of dissolved salts in water. It's a critical oceanographic parameter because it, along with temperature, determines the density of seawater. Density differences drive the large-scale ocean circulation patterns that transport heat around the globe.`
  },
  {
    question: "Why is ocean pH important?",
    answer: `Ocean **pH** is a measure of its acidity. It's a vital sign for ocean health. As the ocean absorbs atmospheric CO₂, its pH decreases (a process called ocean acidification). This can have profound impacts on marine life, especially for organisms that build shells or skeletons, like corals and shellfish.`
  },
  {
    question: "What does a chlorophyll measurement indicate?",
    answer: `A **chlorophyll** measurement is a proxy for the amount of phytoplankton (microscopic marine algae) in the water. Since phytoplankton form the base of most marine food webs, chlorophyll concentration is a key indicator of ocean productivity and biological activity.`
  },
  {
    question: "What is an Oxygen Minimum Zone (OMZ)?",
    answer: `An **Oxygen Minimum Zone (OMZ)** is an area in the ocean where oxygen saturation is at its lowest level. These zones occur at intermediate depths (typically 200-1,000 meters) and are a natural feature of the ocean, but they can expand due to climate change, impacting marine ecosystems.`
  },
  {
    question: "How deep do Argo floats go?",
    answer: `Standard Argo floats are designed to profile the top **2,000 meters** (or 2,000 decibars of pressure) of the ocean. After drifting at a 'parking depth' of 1,000 meters, they descend to 2,000 meters before starting their data-collecting ascent to the surface.`
  },
  {
    question: "What are BGC-Argo floats?",
    answer: `**BGC-Argo** is an extension of the Argo program that adds **B**io**G**eo**C**hemical sensors to the standard floats. These sensors measure additional parameters crucial for understanding ocean health, such as dissolved oxygen, nitrate, pH, chlorophyll, and sunlight.`
  },
  {
    question: "What is the 'halocline'?",
    answer: "The **halocline** is a layer of water in which the salinity changes rapidly with depth. It's analogous to the thermocline but for salt content. It is a common feature in estuaries and regions where freshwater from rivers meets salty ocean water, like the Bay of Bengal."
  },
  {
    question: "How is ocean pressure measured?",
    answer: "Ocean pressure is measured in **decibars (dbar)**. Conveniently, pressure in decibars is numerically almost equivalent to depth in meters. For example, a pressure of 1000 dbar corresponds to a depth of approximately 1000 meters. Floats use pressure sensors to determine their depth."
  },
  {
    question: "What is Downwelling PAR?",
    answer: "**Downwelling PAR** stands for **P**hotosynthetically **A**vailable **R**adiation that is traveling downwards into the ocean. It measures the amount of light available for phytoplankton to perform photosynthesis. This is crucial for understanding the base of the ocean's food web."
  },
  {
    question: "How long does an Argo float last?",
    answer: "The design life of an Argo float is typically **4 to 5 years**. During this time, a float can complete over 150 cycles of descending, drifting, and ascending to the surface to transmit data."
  },
  {
    question: "What is a 'water mass'?",
    answer: "A **water mass** is a large body of ocean water with a distinct and identifiable set of properties, primarily temperature and salinity. By plotting these properties on a Temperature-Salinity (T-S) diagram, oceanographers can identify and trace water masses as they move through the ocean."
  },
  {
    question: "How does Argo help with climate change studies?",
    answer: "The Argo program provides a continuous, global dataset of ocean temperature and heat content. Since the ocean absorbs over 90% of the excess heat from global warming, Argo's data is absolutely critical for monitoring climate change, understanding its effects, and improving climate models."
  },
  {
    question: "What is CDOM?",
    answer: "**CDOM** stands for **C**olored **D**issolved **O**rganic **M**atter. It is the optically measurable component of the dissolved organic matter in water. It affects the color of the water and how far light penetrates, which has implications for photosynthesis."
  },
{
    question: "What is Nitrate in the ocean?",
    answer: "**Nitrate (NO₃⁻)** is a crucial nutrient for phytoplankton, the base of the marine food web. Its availability often limits how much phytoplankton can grow in a region, making it a key parameter for studying ocean productivity and the biological carbon pump."
  },
  {
    question: "What is BBP700?",
    answer: "**BBP700** refers to the **B**ackscattering **C**oefficient of particles in the water, measured at a wavelength of 700 nanometers. It is a proxy for the concentration of particulate matter, including phytoplankton and other organic particles. It helps scientists understand the 'biological carbon pump'."
  },
  {
    question: "How do Argo floats navigate?",
    answer: "Argo floats are **passive drifters**; they do not have motors or propellers. They are designed to be neutrally buoyant at their parking depth and are carried by the ocean currents. Their position is determined by GPS only when they surface to transmit data."
  },
  {
    question: "Can Argo floats measure currents?",
    answer: "Yes, indirectly. By knowing the float's position at the start and end of its subsurface drift period, scientists can calculate the average velocity of the current at the float's parking depth. This has provided unprecedented insight into deep ocean circulation."
  },
  {
    question: "Why is the Bay of Bengal less salty?",
    answer: "The Bay of Bengal has lower surface salinity compared to the Arabian Sea primarily due to the massive influx of freshwater from major rivers like the Ganges, Brahmaputra, and Meghna. This freshwater spreads over the surface, creating a highly stratified and less saline upper layer."
  },
  {
    question: "What causes phytoplankton blooms?",
    answer: "Phytoplankton blooms occur when conditions are right for rapid growth. This usually involves a combination of: \n1.  **High Nutrient Levels:** An abundance of nutrients like nitrate and phosphate. \n2.  **Sufficient Light:** Enough sunlight for photosynthesis. \n3.  **Stable Water Column:** Calm conditions that keep phytoplankton in the sunlit zone."
  },
  {
    question: "How does temperature affect oxygen in water?",
    answer: "The solubility of oxygen in water is inversely related to temperature. **Colder water can hold more dissolved oxygen than warmer water.** This is one reason why warming ocean temperatures are a concern, as they can lead to lower oxygen levels, putting stress on marine life."
  },
  {
    question: "What is NetCDF?",
    answer: "**NetCDF (Network Common Data Form)** is a widely used data format in atmospheric and oceanographic sciences. It's a self-describing, machine-independent format designed for storing array-oriented scientific data. Argo data is primarily distributed in NetCDF format."
  }
]
