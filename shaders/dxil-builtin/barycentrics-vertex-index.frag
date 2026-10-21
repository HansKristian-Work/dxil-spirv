float main(nointerpolation float a : ATTRIB, float3 bary : SV_Barycentrics) : SV_Target
{
	return GetAttributeAtVertex(a, 2) * bary.x;
}
