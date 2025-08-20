

export const RidesDetailSkeleton = ({ name, heading }: { name?: string, heading?: string }) => {
    return (

        <div className='flex flex-col  py-2 '>
            <h5 className='font-bold '>{heading}</h5>
            <p className='text-black text-body-lg font-medium'>{name}</p>
        </div>

    )
}