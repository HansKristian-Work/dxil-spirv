float main(
		nointerpolation float attrib0 : ATTRIB,
		nointerpolation float attrib1 : ATTRIB1,
		nointerpolation float attrib2 : ATTRIB2,
		sample float3 bary : SV_Barycentrics,
		centroid float foo : FOO) : SV_Target
{
	float result = 0.0;
	result += GetAttributeAtVertex(attrib0, 0) * bary.x;
	result += GetAttributeAtVertex(attrib1, 1) * bary.y;
	result += GetAttributeAtVertex(attrib2, 2) * bary.z;
	result += foo;
	return result;
}
