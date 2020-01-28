float2 main(uint index : SV_SampleIndex) : SV_Target
{
	return GetRenderTargetSamplePosition(index);
}
