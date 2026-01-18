
export const getCompatibility = async (req: any, res: any) => {
  // Static response disconnected from GoogleGenAI
  res.json({
    score: 88,
    insight: "Profiles show high alignment in core registry values and timeline expectations."
  });
};
