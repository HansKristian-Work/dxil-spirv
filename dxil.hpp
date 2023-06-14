/* Copyright (c) 2019-2022 Hans-Kristian Arntzen for Valve Corporation
 *
 * SPDX-License-Identifier: MIT
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

#pragma once

#include "thread_local_allocator.hpp"
#include <stddef.h>
#include <stdint.h>

namespace DXIL
{
constexpr size_t ContainerHashSize = 16;

struct ContainerHeader
{
	uint32_t header_fourcc;
	uint8_t digest[ContainerHashSize];
	uint16_t major_version;
	uint16_t minor_version;
	uint32_t container_size_in_bytes;
	uint32_t part_count;
};

struct PartHeader
{
	uint32_t part_fourcc;
	uint32_t part_size;
};

struct ProgramHeader
{
	uint32_t program_version;
	uint32_t size_in_uint32;
	uint32_t dxil_magic;
	uint32_t dxil_version;
	uint32_t bitcode_offset;
	uint32_t bitcode_size;
};

struct IOElement
{
	dxil_spv::String semantic_name;
	uint32_t stream_index;
	uint32_t semantic_index;
	uint32_t system_value_semantic;
	uint32_t component_type;
	uint32_t register_index;
	uint32_t mask;
	uint32_t min_precision;
};

constexpr uint32_t fourcc(uint32_t a, uint32_t b, uint32_t c, uint32_t d)
{
	return a | (b << 8) | (c << 16) | (d << 24);
}

enum class FourCC : uint32_t
{
	Container = fourcc('D', 'X', 'B', 'C'),
	ResourceDef = fourcc('R', 'D', 'E', 'F'),
	InputSignature = fourcc('I', 'S', 'G', '1'),
	OutputSignature = fourcc('O', 'S', 'G', '1'),
	PatchConstantSignature = fourcc('P', 'S', 'G', '1'),
	ShaderStatistics = fourcc('S', 'T', 'A', 'T'),
	ShaderDebugInfoDXIL = fourcc('I', 'L', 'D', 'B'),
	ShaderDebugName = fourcc('I', 'L', 'D', 'N'),
	FeatureInfo = fourcc('S', 'F', 'I', '0'),
	PrivateData = fourcc('P', 'R', 'I', 'V'),
	RootSignature = fourcc('R', 'T', 'S', '0'),
	DXIL = fourcc('D', 'X', 'I', 'L'),
	PipelineStateValidation = fourcc('P', 'S', 'V', '0'),
	RuntimeData = fourcc('R', 'D', 'A', 'T'),
	ShaderHash = fourcc('H', 'A', 'S', 'H')
};

enum class RuntimeDataPartType : uint32_t
{
	Invalid = 0,
	StringBuffer = 1,
	IndexArrays = 2,
	ResourceTable = 3,
	FunctionTable = 4,
	RawBytes = 5,
	SubobjectTable = 6
};

enum class SubobjectKind : uint32_t
{
	StateObjectConfig = 0,
	GlobalRootSignature = 1,
	LocalRootSignature = 2,
	SubobjectToExportsAssociation = 8,
	RaytracingShaderConfig = 9,
	RaytracingPipelineConfig = 10,
	HitGroup = 11,
	RaytracingPipelineConfig1 = 12
};

enum class HitGroupType : uint32_t
{
	Triangle = 0,
	Procedural = 1
};

enum class ComponentType : uint8_t
{
	Invalid = 0,
	I1,
	I16,
	U16,
	I32,
	U32,
	I64,
	U64,
	F16,
	F32,
	F64,
	SNormF16,
	UNormF16,
	SNormF32,
	UNormF32,
	SNormF64,
	UNormF64
};

enum class InterpolationMode : uint8_t
{
	Undefined,
	Constant,
	Linear,
	LinearCentroid,
	LinearNoperspective,
	LinearNoperspectiveCentroid,
	LinearSample,
	LinearNoperspectiveSample,
	Invalid
};

enum class Semantic : uint8_t
{
	User,
	VertexID,
	InstanceID,
	Position,
	RenderTargetArrayIndex,
	ViewPortArrayIndex,
	ClipDistance,
	CullDistance,
	OutputControlPointID,
	DomainLocation,
	PrimitiveID,
	GSInstanceID,
	SampleIndex,
	IsFrontFace,
	Coverage,
	InnerCoverage,
	Target,
	Depth,
	DepthLessEqual,
	DepthGreaterEqual,
	StencilRef,
	DispatchThreadID,
	GroupID,
	GroupIndex,
	GroupThreadID,
	TessFactor,
	InsideTessFactor,
	ViewID,
	Barycentrics,
	ShadingRate,
	CullPrimitive,

	// Fake semantics to disambiguate semantics based on interpolation flags.
	InternalBarycentricsNoPerspective = 255
};

enum class ResourceType : uint8_t
{
	SRV = 0,
	UAV = 1,
	CBV = 2,
	Sampler = 3
};

enum class ResourceKind : uint8_t
{
	Invalid = 0,
	Texture1D,
	Texture2D,
	Texture2DMS,
	Texture3D,
	TextureCube,
	Texture1DArray,
	Texture2DArray,
	Texture2DMSArray,
	TextureCubeArray,
	TypedBuffer,
	RawBuffer,
	StructuredBuffer,
	CBuffer,
	Sampler,
	TBuffer,
	RTAccelerationStructure,
	FeedbackTexture2D,
	FeedbackTexture2DArray
};

enum class Op : unsigned
{
	// Input output
	TempRegLoad = 0,
	TempRegStore = 1,
	MinPrecXRegLoad = 2,
	MinPrecXRegStore = 3,
	LoadInput = 4,
	StoreOutput = 5,
	FAbs = 6,
	Saturate = 7,
	IsNan = 8,
	IsInf = 9,
	IsFinite = 10,
	IsNormal = 11,
	Cos = 12,
	Sin = 13,
	Tan = 14,
	Acos = 15,
	Asin = 16,
	Atan = 17,
	Hcos = 18,
	Hsin = 19,
	Htan = 20,
	Exp = 21,
	Frc = 22,
	Log = 23,
	Sqrt = 24,
	Rsqrt = 25,
	Round_ne = 26,
	Round_ni = 27,
	Round_pi = 28,
	Round_z = 29,
	Bfrev = 30,
	Countbits = 31,
	FirstbitLo = 32,
	FirstbitHi = 33,
	FirstbitSHi = 34,
	FMax = 35,
	FMin = 36,
	IMax = 37,
	IMin = 38,
	UMax = 39,
	UMin = 40,
	IMul = 41,
	UMul = 42,
	UDiv = 43,
	UAddc = 44,
	USubb = 45,
	FMad = 46,
	Fma = 47,
	IMad = 48,
	UMad = 49,
	Msad = 50,
	Ibfe = 51,
	Ubfe = 52,
	Bfi = 53,
	Dot2 = 54,
	Dot3 = 55,
	Dot4 = 56,
	CreateHandle = 57,
	CBufferLoad = 58,
	CBufferLoadLegacy = 59,
	Sample = 60,
	SampleBias = 61,
	SampleLevel = 62,
	SampleGrad = 63,
	SampleCmp = 64,
	SampleCmpLevelZero = 65,
	TextureLoad = 66,
	TextureStore = 67,
	BufferLoad = 68,
	BufferStore = 69,
	BufferUpdateCounter = 70,
	CheckAccessFullyMapped = 71,
	GetDimensions = 72,
	TextureGather = 73,
	TextureGatherCmp = 74,
	Texture2DMSGetSamplePosition = 75,
	RenderTargetGetSamplePosition = 76,
	RenderTargetGetSampleCount = 77,
	AtomicBinOp = 78,
	AtomicCompareExchange = 79,
	Barrier = 80,
	CalculateLOD = 81,
	Discard = 82,
	DerivCoarseX = 83,
	DerivCoarseY = 84,
	DerivFineX = 85,
	DerivFineY = 86,
	EvalSnapped = 87,
	EvalSampleIndex = 88,
	EvalCentroid = 89,
	SampleIndex = 90,
	Coverage = 91,
	InnerCoverage = 92,
	ThreadId = 93,
	GroupId = 94,
	ThreadIdInGroup = 95,
	FlattenedThreadIdInGroup = 96,
	EmitStream = 97,
	CutStream = 98,
	EmitThenCutStream = 99,
	GSInstanceID = 100,
	MakeDouble = 101,
	SplitDouble = 102,
	LoadOutputControlPoint = 103,
	LoadPatchConstant = 104,
	DomainLocation = 105,
	StorePatchConstant = 106,
	OutputControlPointID = 107,
	PrimitiveID = 108,
	CycleCounterLegacy = 109,
	WaveIsFirstLane = 110,
	WaveGetLaneIndex = 111,
	WaveGetLaneCount = 112,
	WaveAnyTrue = 113,
	WaveAllTrue = 114,
	WaveActiveAllEqual = 115,
	WaveActiveBallot = 116,
	WaveReadLaneAt = 117,
	WaveReadLaneFirst = 118,
	WaveActiveOp = 119,
	WaveActiveBit = 120,
	WavePrefixOp = 121,
	QuadReadLaneAt = 122,
	QuadOp = 123,
	BitcastI16toF16 = 124,
	BitcastF16toI16 = 125,
	BitcastI32toF32 = 126,
	BitcastF32toI32 = 127,
	BitcastI64toF64 = 128,
	BitcastF64toI64 = 129,
	LegacyF32ToF16 = 130,
	LegacyF16ToF32 = 131,
	LegacyDoubleToFloat = 132,
	LegacyDoubleToSInt32 = 133,
	LegacyDoubleToUInt32 = 134,
	WaveAllBitCount = 135,
	WavePrefixBitCount = 136,
	AttributeAtVertex = 137,
	ViewID = 138,
	RawBufferLoad = 139,
	RawBufferStore = 140,
	InstanceID = 141,
	InstanceIndex = 142,
	HitKind = 143,
	RayFlags = 144,
	DispatchRaysIndex = 145,
	DispatchRaysDimensions = 146,
	WorldRayOrigin = 147,
	WorldRayDirection = 148,
	ObjectRayOrigin = 149,
	ObjectRayDirection = 150,
	ObjectToWorld = 151,
	WorldToObject = 152,
	RayTMin = 153,
	RayTCurrent = 154,
	IgnoreHit = 155,
	AcceptHitAndEndSearch = 156,
	TraceRay = 157,
	ReportHit = 158,
	CallShader = 159,
	CreateHandleForLib = 160,
	PrimitiveIndex = 161,
	Dot2AddHalf = 162,
	Dot4AddI8Packed = 163,
	Dot4AddU8Packed = 164,
	WaveMatch = 165,
	WaveMultiPrefixOp = 166,
	WaveMultiPrefixBitCount = 167,
	SetMeshOutputCounts = 168,
	EmitIndices = 169,
	GetMeshPayload = 170,
	StoreVertexOutput = 171,
	StorePrimitiveOutput = 172,
	DispatchMesh = 173,
	WriteSamplerFeedback = 174,
	WriteSamplerFeedbackBias = 175,
	WriteSamplerFeedbackLevel = 176,
	WriteSamplerFeedbackGrad = 177,
	AllocateRayQuery = 178,
	RayQuery_TraceRayInline = 179,
	RayQuery_Proceed = 180,
	RayQuery_Abort = 181,
	RayQuery_CommitNonOpaqueTriangleHit = 182,
	RayQuery_CommitProceduralPrimitiveHit = 183,
	RayQuery_CommittedStatus = 184,
	RayQuery_CandidateType = 185,
	RayQuery_CandidateObjectToWorld3x4 = 186,
	RayQuery_CandidateWorldToObject3x4 = 187,
	RayQuery_CommittedObjectToWorld3x4 = 188,
	RayQuery_CommittedWorldToObject3x4 = 189,
	RayQuery_CandidateProceduralPrimitiveNonOpaque = 190,
	RayQuery_CandidateTriangleFrontFace = 191,
	RayQuery_CommittedTriangleFrontFace = 192,
	RayQuery_CandidateTriangleBarycentrics = 193,
	RayQuery_CommittedTriangleBarycentrics = 194,
	RayQuery_RayFlags = 195,
	RayQuery_WorldRayOrigin = 196,
	RayQuery_WorldRayDirection = 197,
	RayQuery_RayTMin = 198,
	RayQuery_CandidateTriangleRayT = 199,
	RayQuery_CommittedRayT = 200,
	RayQuery_CandidateInstanceIndex = 201,
	RayQuery_CandidateInstanceID = 202,
	RayQuery_CandidateGeometryIndex = 203,
	RayQuery_CandidatePrimitiveIndex = 204,
	RayQuery_CandidateObjectRayOrigin = 205,
	RayQuery_CandidateObjectRayDirection = 206,
	RayQuery_CommittedInstanceIndex = 207,
	RayQuery_CommittedInstanceID = 208,
	RayQuery_CommittedGeometryIndex = 209,
	RayQuery_CommittedPrimitiveIndex = 210,
	RayQuery_CommittedObjectRayOrigin = 211,
	RayQuery_CommittedObjectRayDirection = 212,
	RayQuery_GeometryIndex = 213,
	RayQuery_CandidateInstanceContributionToHitGroupIndex = 214,
	RayQuery_CommittedInstanceContributionToHitGroupIndex = 215,
	AnnotateHandle = 216,
	CreateHandleFromBinding = 217,
	CreateHandleFromHeap = 218,
	Unpack4x8 = 219,
	Pack4x8 = 220,
	IsHelperLane = 221,
	QuadVote = 222,
	SampleCmpLevel = 224,
	TextureStoreSample = 225,

	Count
};

enum class AtomicBinOp : uint8_t
{
	IAdd = 0,
	And = 1,
	Or = 2,
	Xor = 3,
	IMin = 4,
	IMax = 5,
	UMin = 6,
	UMax = 7,
	Exchange = 8
};

enum class ShaderPropertyTag : uint8_t
{
	ShaderFlags = 0,
	GSState = 1,
	DSState = 2,
	HSState = 3,
	NumThreads = 4,
	AutoBindingSpace = 5,
	RayPayloadSize = 6,
	RayAttribSizeTag = 7,
	ShaderKind = 8,
	MSState = 9,
	ASState = 10,
	WaveSize = 11
};

enum class GSStageOutTags : uint32_t
{
	Stream = 0,
	Invalid
};

enum class BarrierMode : uint8_t
{
	Invalid = 0,
	DeviceMemoryBarrier = 2,
	GroupMemoryBarrier = 8,
	AllMemoryBarrier = 10,
	DeviceMemoryBarrierWithGroupSync = 3,
	GroupMemoryBarrierWithGroupSync = 9,
	AllMemoryBarrierWithGroupSync = 11
};

enum class AddressSpace : uint8_t
{
	Thread = 0,
	GroupShared = 3,
	Invalid
};

enum class InputPrimitive : uint8_t
{
	Undefined = 0,
	Point = 1,
	Line = 2,
	Triangle = 3,
	LineWithAdjacency = 6,
	TriangleWithAdjaceny = 7
};

enum class PrimitiveTopology : uint8_t
{
	Undefined = 0,
	PointList = 1,
	LineList = 2,
	LineStrip = 3,
	TriangleList = 4,
	TriangleStrip = 5
};

enum class TessellatorDomain : uint8_t
{
	Undefined = 0,
	IsoLine = 1,
	Tri = 2,
	Quad = 3
};

enum class TessellatorOutputPrimitive : uint8_t
{
	Undefined = 0,
	Point = 1,
	Line = 2,
	TriangleCW = 3,
	TriangleCCW = 4
};

enum class TessellatorPartitioning : uint8_t
{
	Undefined = 0,
	Integer = 1,
	Pow2 = 2,
	FractionalOdd = 3,
	FractionalEven = 4
};

enum class MeshOutputTopology
{
	Undefined = 0,
	Line = 1,
	Triangle = 2
};

enum ShaderFlag
{
	ShaderFlagEarlyDepthStencil = 1 << 3,
	ShaderFlagNativeLowPrecision = 1 << 23
};

enum class WaveOpKind : uint8_t
{
	Sum = 0,
	Product = 1,
	Min = 2,
	Max = 3
};

enum class WaveBitOpKind : uint8_t
{
	And = 0,
	Or = 1,
	Xor = 2
};

enum class WaveMultiPrefixOpKind : uint8_t
{
	Sum = 0,
	And = 1,
	Or = 2,
	Xor = 3,
	Product = 4
};

enum class SignedOpKind : uint8_t
{
	Signed = 0,
	Unsigned = 1
};

enum class ShaderKind
{
	Pixel = 0,
	Vertex,
	Geometry,
	Hull,
	Domain,
	Compute,
	Library,
	RayGeneration,
	Intersection,
	AnyHit,
	ClosestHit,
	Miss,
	Callable,
	Mesh,
	Amplification,
	Invalid
};

} // namespace DXIL
