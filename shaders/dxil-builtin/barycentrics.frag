float4 main(
		nointerpolation float4 attrib : ATTRIB, nointerpolation float4 attrib2[2] : ATTRIB2,
		float3 bary : SV_Barycentrics, centroid noperspective float3 bary2 : SV_Barycentrics1, nointerpolation uint index : INDEX) : SV_Target
{
	float4 result = float4(bary.xy, bary2.yx);
	result += GetAttributeAtVertex(attrib, 0) * bary.x;
	result += GetAttributeAtVertex(attrib, 1) * bary.y;
	result += GetAttributeAtVertex(attrib2[index], 0) * bary.z;
	result += GetAttributeAtVertex(attrib2[0], 1) * bary2.x;
	result += GetAttributeAtVertex(attrib2[0], 2) * bary2.y;
	result += GetAttributeAtVertex(attrib2[1], 0) * bary2.x;
	result += GetAttributeAtVertex(attrib2[1], 1) * bary2.y;
	result += attrib;
	return result;
}
